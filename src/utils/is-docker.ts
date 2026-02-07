import { readFileSync, statSync } from 'node:fs'

let isDockerCached: boolean | undefined

function hasDockerEnv(): boolean {
  try {
    statSync('/.dockerenv')
    return true
  }
  catch {
    return false
  }
}

function hasDockerCGroup(): boolean {
  try {
    return readFileSync('/proc/self/cgroup', 'utf8').includes('docker')
  }
  catch {
    return false
  }
}

function hasDockerMountInfo(): boolean {
  try {
    return readFileSync('/proc/self/mountinfo', 'utf8').includes('/docker/containers/')
  }
  catch {
    return false
  }
}

export function isDocker(): boolean {
  isDockerCached ??= hasDockerEnv() || hasDockerCGroup() || hasDockerMountInfo()
  return isDockerCached
}
