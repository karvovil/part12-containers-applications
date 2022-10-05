import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'
//const baseUrl = '/api/persons'
const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
  return response.data
}
const create = async newObject => {
    const request = axios.post(baseUrl, newObject)
    const response = await request
  return response.data
  }
  const deletePerson = async id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    const response = await request
    return response.status
  }
const put = async (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson)
  const response = await request
  return response.data
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, deletePerson, put }