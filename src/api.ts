import { Appwrite } from 'appwrite';

export const api = new Appwrite();
api.setEndpoint('https://lwj.sideproject.live/v1');
api.setProject('lwj-vote');