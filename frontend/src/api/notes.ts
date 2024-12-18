import type {  NoteDetails, NoteOverview } from '../../../shared/types/notes.ts'
import { axiosInstance, backendHost } from './api.ts'

export const getNotes = async (): Promise<{ notes: NoteOverview[] }> => {
  return axiosInstance.get(`${ backendHost }/api/notes`).then(response => response.data)
}

export const getNote = async (id: number): Promise<NoteDetails> => {
  return axiosInstance.get(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}

export const newNote = async (): Promise<{ id: number }> => {
  return axiosInstance.post(`${ backendHost }/api/notes`).then(response => response.data)
}

export const saveNote = async (id: number, content: string): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notes/${ id }`, { content }).then(response => response.data)
}

export const deleteNote = async (id: number): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}

export const setNoteVisibility = async (id: number, visible: boolean): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notes/${ id }/visibility`, { visible }).then(response => response.data)
}