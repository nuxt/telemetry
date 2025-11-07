/*
This is a fork of the original git-url-parse package (https://github.com/IonicaBizau/git-url-parse).
This has been migrated to be included in the package to avoid the dependency on the original package.
*/

/**
 * protocols
 * Returns the protocols of an input url.
 *
 * @param input The input url (string or `URL` instance)
 * @param first If `true`, the first protocol will be returned. If number, it will represent the zero-based index of the protocols array.
 * @return The array of protocols or the specified protocol.
 */
function protocols(input: string | URL, first?: boolean | number): string[] | string {
  if (first === true) {
    first = 0
  }

  let prots = ''
  if (typeof input === 'string') {
    try {
      prots = new URL(input).protocol
    }
    catch {
      // ignore
    }
  }
  else if (input && input.constructor === URL) {
    prots = input.protocol
  }

  const splits = prots.split(/[:+]/).filter(Boolean)
  if (typeof first === 'number') {
    return splits[first]
  }
  return splits
}

/**
 * isSsh
 * Checks if an input value is a ssh url or not.
 *
 * @param input The input url or an array of protocols.
 * @return `true` if the input is a ssh url, `false` otherwise.
 */
function isSsh(input: string | string[]): boolean {
  if (Array.isArray(input)) {
    return input.includes('ssh') || input.includes('rsync')
  }

  if (typeof input !== 'string') {
    return false
  }

  const prots = protocols(input) as string[]
  input = input.substring(input.indexOf('://') + 3)
  if (isSsh(prots)) {
    return true
  }

  // TODO This probably could be improved :)
  const urlPortPattern = /\.([a-z\d]+):(\d+)\//i
  return !input.match(urlPortPattern) && input.indexOf('@') < input.indexOf(':')
}

interface ParsePathOutput {
  protocols: string[]
  protocol: string | null
  port: string | null
  resource: string
  host: string
  user: string
  password: string
  pathname: string
  hash: string
  search: string
  href: string
  query: Record<string, string>
  parse_failed: boolean
}

/**
 * parsePath
 * Parses the input url.
 *
 * @param url The input url.
 * @return An object containing the parsed url fields.
 */
function parsePath(url: string): ParsePathOutput {
  const output: ParsePathOutput = {
    protocols: [],
    protocol: null,
    port: null,
    resource: '',
    host: '',
    user: '',
    password: '',
    pathname: '',
    hash: '',
    search: '',
    href: url,
    query: {},
    parse_failed: false,
  }

  try {
    const parsed = new URL(url)

    output.protocols = protocols(parsed) as string[]
    output.protocol = output.protocols[0]
    output.port = parsed.port
    output.resource = parsed.hostname
    output.host = parsed.host
    output.user = parsed.username || ''
    output.password = parsed.password || ''
    output.pathname = parsed.pathname
    output.hash = parsed.hash.slice(1)
    output.search = parsed.search.slice(1)
    output.href = parsed.href
    output.query = Object.fromEntries(parsed.searchParams)
  }
  catch {
    // TODO Maybe check if it is a valid local file path
    //      In any case, these will be parsed by higher
    //      level parsers such as parse-url, git-url-parse, git-up
    output.protocols = ['file']
    output.protocol = output.protocols[0]
    output.port = ''
    output.resource = ''
    output.user = ''
    output.pathname = ''
    output.hash = ''
    output.search = ''
    output.href = url
    output.query = {}
    output.parse_failed = true
  }

  return output
}

/**
 * Normalize URL options
 */
interface NormalizeOptions {
  stripHash?: boolean
  [key: string]: any
}

/**
 * parseUrl
 * Parses the input url.
 *
 * **Note**: This *throws* if invalid urls are provided.
 *
 * @param url The input url.
 * @param normalize Whether to normalize the url or not.
 * Default is `false`. If `true`, the url will be normalized. If an object,
 * it will be the options object sent to normalize-url. For SSH urls, normalize won't work.
 *
 * @return An object containing the parsed url fields.
 */
function parseUrl(url: string, normalize: boolean | NormalizeOptions = false): ParsePathOutput {
  // Constants
  /**
   * ([a-zA-Z_][a-zA-Z0-9_-]{0,31}) Try to match the user
   * ([\w\.\-@]+) Match the host/resource
   * (([\~,\.\w,\-,\_,\/,\s]|%[0-9A-Fa-f]{2})+?(?:\.git|\/)?) Match the path, allowing spaces/white
   */
  const GIT_RE = /^(?:([a-zA-Z_][\w-]{0,31})@|https?:\/\/)([\w.\-@]+)[/:](([~,.\w\-/\s]|%[0-9A-Fa-f]{2})+?(?:\.git|\/)?)$/

  const throwErr = (msg: string) => {
    const err = new TypeError(msg) as TypeError & { subject_url?: string }
    err.subject_url = url
    throw err
  }

  if (typeof url !== 'string' || !url.trim()) {
    throwErr('Invalid url.')
  }

  if (url.length > parseUrl.MAX_INPUT_LENGTH) {
    throwErr('Input exceeds maximum length. If needed, change the value of parseUrl.MAX_INPUT_LENGTH.')
  }

  if (normalize) {
    // Dynamic import for normalize-url to avoid requiring it if not needed
    // For now, we'll skip normalization if normalize-url is not available
    // In a real implementation, you'd want to add normalize-url as a dependency
    if (typeof normalize !== 'object') {
      normalize = {
        stripHash: false,
      }
    }
    // Note: normalize-url would be used here, but we'll skip for now
    // url = normalizeUrl(url, normalize)
  }

  const parsed = parsePath(url)

  // Potential git-ssh urls
  if (parsed.parse_failed) {
    const matched = parsed.href.match(GIT_RE)
    if (matched) {
      parsed.protocols = ['ssh']
      parsed.protocol = 'ssh'
      parsed.resource = matched[2]
      parsed.host = matched[2]
      parsed.user = matched[1] || ''
      parsed.pathname = `/${matched[3]}`
      parsed.parse_failed = false
    }
    else {
      throwErr('URL parsing failed.')
    }
  }

  return parsed
}

parseUrl.MAX_INPUT_LENGTH = 2048

interface GitUpOutput extends ParsePathOutput {
  token: string
}

/**
 * gitUp
 * Parses the input url.
 *
 * @param input The input url.
 * @return An object containing the parsed git url fields.
 */
function gitUp(input: string): GitUpOutput {
  const output = parseUrl(input) as GitUpOutput

  output.token = ''
  if (output.password === 'x-oauth-basic') {
    output.token = output.user
  }
  else if (output.user === 'x-token-auth') {
    output.token = output.password
  }

  if (isSsh(output.protocols) || (output.protocols.length === 0 && isSsh(input))) {
    output.protocol = 'ssh'
  }
  else if (output.protocols.length) {
    output.protocol = output.protocols[0]
  }
  else {
    output.protocol = 'file'
    output.protocols = ['file']
  }

  output.href = output.href.replace(/\/$/, '')
  return output
}

export interface GitUrl extends GitUpOutput {
  source: string
  owner: string
  name: string
  ref: string
  filepath: string
  filepathtype: string
  full_name: string
  organization?: string
  git_suffix: boolean
  commit?: string
  toString: (type?: string) => string
}

/**
 * gitUrlParse
 * Parses a Git url.
 *
 * @param url The Git url to parse.
 * @param refs An array of strings representing the refs. This is
 *  helpful in the context of the URLs that contain branches with slashes.
 *  If user wants to identify the branch, he should pass all branch names
 *  of the project as part of refs parameter
 * @return The `GitUrl` object containing parsed git url information.
 */
function gitUrlParse(url: string, refs: string[] = []): GitUrl {
  if (typeof url !== 'string') {
    throw new TypeError('The url must be a string.')
  }

  if (!refs.every(item => typeof item === 'string')) {
    throw new TypeError('The refs should contain only strings')
  }

  const shorthandRe = /^[\w-]{1,39}\/[-.\w]{1,100}$/
  if (shorthandRe.test(url)) {
    url = `https://github.com/${url}`
  }

  const urlInfo = gitUp(url) as GitUrl
  const sourceParts = urlInfo.resource.split('.')
  let splits: string[] | null = null

  urlInfo.toString = function (type?: string) {
    return gitUrlParse.stringify(this, type)
  }

  urlInfo.source = sourceParts.length > 2
    ? sourceParts.slice(1 - sourceParts.length).join('.')
    : (urlInfo.source = urlInfo.resource)

  // Note: Some hosting services (e.g. Visual Studio Team Services) allow whitespace characters
  // in the repository and owner names so we decode the URL pieces to get the correct result
  urlInfo.git_suffix = /\.git$/.test(urlInfo.pathname)
  urlInfo.name = decodeURIComponent((urlInfo.pathname || urlInfo.href).replace(/(^\/)|(\/$)/g, '').replace(/\.git$/, ''))
  urlInfo.owner = decodeURIComponent(urlInfo.user)

  switch (urlInfo.source) {
    case 'git.cloudforge.com': {
      urlInfo.owner = urlInfo.user
      urlInfo.organization = sourceParts[0]
      urlInfo.source = 'cloudforge.com'
      break
    }

    case 'visualstudio.com': {
      // Handle VSTS SSH URLs
      if (urlInfo.resource === 'vs-ssh.visualstudio.com') {
        splits = urlInfo.name.split('/')
        if (splits.length === 4) {
          urlInfo.organization = splits[1]
          urlInfo.owner = splits[2]
          urlInfo.name = splits[3]
          urlInfo.full_name = `${splits[2]}/${splits[3]}`
        }
        break
      }
      else {
        splits = urlInfo.name.split('/')
        if (splits.length === 2) {
          urlInfo.owner = splits[1]
          urlInfo.name = splits[1]
          urlInfo.full_name = `_git/${urlInfo.name}`
        }
        else if (splits.length === 3) {
          urlInfo.name = splits[2]
          if (splits[0] === 'DefaultCollection') {
            urlInfo.owner = splits[2]
            urlInfo.organization = splits[0]
            urlInfo.full_name = `${urlInfo.organization}/_git/${urlInfo.name}`
          }
          else {
            urlInfo.owner = splits[0]
            urlInfo.full_name = `${urlInfo.owner}/_git/${urlInfo.name}`
          }
        }
        else if (splits.length === 4) {
          urlInfo.organization = splits[0]
          urlInfo.owner = splits[1]
          urlInfo.name = splits[3]
          urlInfo.full_name = `${urlInfo.organization}/${urlInfo.owner}/_git/${urlInfo.name}`
        }
        break
      }
    }

    // Azure DevOps (formerly Visual Studio Team Services)
    case 'dev.azure.com':
    case 'azure.com': {
      if (urlInfo.resource === 'ssh.dev.azure.com') {
        splits = urlInfo.name.split('/')
        if (splits.length === 4) {
          urlInfo.organization = splits[1]
          urlInfo.owner = splits[2]
          urlInfo.name = splits[3]
        }
        break
      }
      else {
        splits = urlInfo.name.split('/')
        if (splits.length === 5) {
          urlInfo.organization = splits[0]
          urlInfo.owner = splits[1]
          urlInfo.name = splits[4]
          urlInfo.full_name = `_git/${urlInfo.name}`
        }
        else if (splits.length === 3) {
          urlInfo.name = splits[2]
          if (splits[0] === 'DefaultCollection') {
            urlInfo.owner = splits[2]
            urlInfo.organization = splits[0]
            urlInfo.full_name = `${urlInfo.organization}/_git/${urlInfo.name}`
          }
          else {
            urlInfo.owner = splits[0]
            urlInfo.full_name = `${urlInfo.owner}/_git/${urlInfo.name}`
          }
        }
        else if (splits.length === 4) {
          urlInfo.organization = splits[0]
          urlInfo.owner = splits[1]
          urlInfo.name = splits[3]
          urlInfo.full_name = `${urlInfo.organization}/${urlInfo.owner}/_git/${urlInfo.name}`
        }

        if (urlInfo.query && urlInfo.query.path) {
          urlInfo.filepath = urlInfo.query.path.replace(/^\/+/g, '') // Strip leading slash (/)
        }
        if (urlInfo.query && urlInfo.query.version) { // version=GB<branch>
          urlInfo.ref = urlInfo.query.version.replace(/^GB/, '') // remove GB
        }
        break
      }
    }

    default: {
      splits = urlInfo.name.split('/')
      let nameIndex = splits.length - 1
      if (splits.length >= 2) {
        const dashIndex = splits.indexOf('-', 2)
        const blobIndex = splits.indexOf('blob', 2)
        const treeIndex = splits.indexOf('tree', 2)
        const commitIndex = splits.indexOf('commit', 2)
        const issuesIndex = splits.indexOf('issues', 2)
        const srcIndex = splits.indexOf('src', 2)
        const rawIndex = splits.indexOf('raw', 2)
        const editIndex = splits.indexOf('edit', 2)
        nameIndex = dashIndex > 0
          ? dashIndex - 1
          : blobIndex > 0 && treeIndex > 0
            ? Math.min(blobIndex - 1, treeIndex - 1)
            : blobIndex > 0
              ? blobIndex - 1
              : issuesIndex > 0
                ? issuesIndex - 1
                : treeIndex > 0
                  ? treeIndex - 1
                  : commitIndex > 0
                    ? commitIndex - 1
                    : srcIndex > 0
                      ? srcIndex - 1
                      : rawIndex > 0
                        ? rawIndex - 1
                        : editIndex > 0
                          ? editIndex - 1
                          : nameIndex
        urlInfo.owner = splits.slice(0, nameIndex).join('/')
        urlInfo.name = splits[nameIndex]
        if (commitIndex && issuesIndex < 0) {
          urlInfo.commit = splits[nameIndex + 2]
        }
      }
      urlInfo.ref = ''
      urlInfo.filepathtype = ''
      urlInfo.filepath = ''
      const offsetNameIndex = splits.length > nameIndex && splits[nameIndex + 1] === '-' ? nameIndex + 1 : nameIndex
      if ((splits.length > offsetNameIndex + 2) && (['raw', 'src', 'blob', 'tree', 'edit'].includes(splits[offsetNameIndex + 1]))) {
        urlInfo.filepathtype = splits[offsetNameIndex + 1]
        urlInfo.ref = splits[offsetNameIndex + 2]
        if (splits.length > offsetNameIndex + 3) {
          urlInfo.filepath = splits.slice(offsetNameIndex + 3).join('/')
        }
      }
      urlInfo.organization = urlInfo.owner
      break
    }
  }

  if (!urlInfo.full_name) {
    urlInfo.full_name = urlInfo.owner
    if (urlInfo.name) {
      if (urlInfo.full_name) {
        urlInfo.full_name += '/'
      }
      urlInfo.full_name += urlInfo.name
    }
  }

  // Bitbucket Server
  if (urlInfo.owner.startsWith('scm/')) {
    urlInfo.source = 'bitbucket-server'
    urlInfo.owner = urlInfo.owner.replace('scm/', '')
    urlInfo.organization = urlInfo.owner
    urlInfo.full_name = `${urlInfo.owner}/${urlInfo.name}`
  }

  const bitbucket = /(projects|users)\/([^/]+)\/repos\/([^/]+)((\/.*$)|$)/
  const matches = bitbucket.exec(urlInfo.pathname)
  if (matches != null) {
    urlInfo.source = 'bitbucket-server'
    if (matches[1] === 'users') {
      urlInfo.owner = `~${matches[2]}`
    }
    else {
      urlInfo.owner = matches[2]
    }
    urlInfo.organization = urlInfo.owner
    urlInfo.name = matches[3]
    splits = matches[4].split('/')
    if (splits.length > 1) {
      if (['raw', 'browse'].includes(splits[1])) {
        urlInfo.filepathtype = splits[1]
        if (splits.length > 2) {
          urlInfo.filepath = splits.slice(2).join('/')
        }
      }
      else if (splits[1] === 'commits' && splits.length > 2) {
        urlInfo.commit = splits[2]
      }
    }
    urlInfo.full_name = `${urlInfo.owner}/${urlInfo.name}`
    if (urlInfo.query.at) {
      urlInfo.ref = urlInfo.query.at
    }
    else {
      urlInfo.ref = ''
    }
  }

  if (refs.length !== 0 && urlInfo.ref) {
    urlInfo.ref = findLongestMatchingSubstring(urlInfo.href, refs) || urlInfo.ref
    urlInfo.filepath = urlInfo.href.split(`${urlInfo.ref}/`)[1]
  }

  return urlInfo
}

/**
 * stringify
 * Stringifies a `GitUrl` object.
 *
 * @param obj The parsed Git url object.
 * @param type The type of the stringified url (default `obj.protocol`).
 * @return The stringified url.
 */
gitUrlParse.stringify = function (obj: GitUrl, type?: string): string {
  type = type || ((obj.protocols && obj.protocols.length) ? obj.protocols.join('+') : obj.protocol || '')

  const port = obj.port ? `:${obj.port}` : ''
  const user = obj.user || 'git'
  const maybeGitSuffix = obj.git_suffix ? '.git' : ''

  switch (type) {
    case 'ssh': {
      if (port)
        return `ssh://${user}@${obj.resource}${port}/${obj.full_name}${maybeGitSuffix}`
      else
        return `${user}@${obj.resource}:${obj.full_name}${maybeGitSuffix}`
    }

    case 'git+ssh':
    case 'ssh+git':
    case 'ftp':
    case 'ftps': {
      return `${type}://${user}@${obj.resource}${port}/${obj.full_name}${maybeGitSuffix}`
    }

    case 'http':
    case 'https': {
      const auth = obj.token
        ? buildToken(obj)
        : obj.user && (obj.protocols.includes('http') || obj.protocols.includes('https'))
          ? `${obj.user}@`
          : ''
      return `${type}://${auth}${obj.resource}${port}/${buildPath(obj)}${maybeGitSuffix}`
    }

    default: {
      return obj.href
    }
  }
}

/**
 * buildToken
 * Builds OAuth token prefix (helper function)
 *
 * @param obj The parsed Git url object.
 * @return token prefix
 */
function buildToken(obj: GitUrl): string {
  switch (obj.source) {
    case 'bitbucket.org': {
      return `x-token-auth:${obj.token}@`
    }
    default: {
      return `${obj.token}@`
    }
  }
}

function buildPath(obj: GitUrl): string {
  switch (obj.source) {
    case 'bitbucket-server': {
      return `scm/${obj.full_name}`
    }
    default: {
      // Note: Re-encode the repository and owner names for hosting services that allow whitespace characters
      const encoded_full_name = obj.full_name
        .split('/')
        .map(x => encodeURIComponent(x))
        .join('/')
      return encoded_full_name
    }
  }
}

function findLongestMatchingSubstring(string: string, array: string[]): string {
  let longestMatch = ''
  array.forEach((item) => {
    if (string.includes(item) && item.length > longestMatch.length) {
      longestMatch = item
    }
  })
  return longestMatch
}

export default gitUrlParse
