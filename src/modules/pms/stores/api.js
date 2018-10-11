import axios from 'axios'

const DEV = process.env.NODE_ENV === 'dev';

const baseUrl = (DEV ? '/' : 'http://localhost:8081/')

export function fetchItem (id) {
  return axios.get(`${baseUrl}api/items/${id}`)
}

export function fetchItems () {
  return axios.get(`${baseUrl}api/items`)
}

export function addItem (item) {
  return axios.post(`${baseUrl}api/items`, item)
}
