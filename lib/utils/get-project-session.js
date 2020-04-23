import { machineId } from 'node-machine-id'

export async function getProjectSession({ _id }) {
  return `${_id}-${await machineId()}`
}
