import { machineId } from 'node-machine-id'

export async function getProjectId({ projectData }) {
  return projectData.remote
    ? `${projectData.source}-${projectData.owner}-${projectData.name}`
    : `${projectData.path}-${await machineId()}`
}
