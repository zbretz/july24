import { io } from 'socket.io-client';
import url from './url_toggle'

export const socket = io(url); 
// export const socket = io('wss://summer.theparkcityapp.com:3100/'); 