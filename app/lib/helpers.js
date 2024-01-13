
/*
export const uniqueId = (function () {
    let num = 0;
    return function (prefix) {
        prefix = String(prefix) || '';
        num += 1;
        return prefix + num;
    }
}
    ());
let id = uniqueId('id_');
console.log(id); // 'id_1'
*/

//import { randomUUID } from "crypto";

//generateUID() {
//    return btoa(this.constructor.name);
//}

export const generateId_ = (function () {
    //console.log(this.crypto.randomUUID()); // f81e7af3-fcf4-4cdd-b3a3-14a8087aa191
    //return randomUUID;
   //  return crypto.randomUUID();
   //const {v4 : uuidv4} = require("uuid");
   //return uuidv4();
   return require('crypto').randomBytes(32).toString('hex');
});

/*
type AuthAdapter = {
    // Create type for createSession
    token: string;
}
  
  export function authAdapter(): AuthAdapter {
    return {

*/
export const generateId = (function () {
 
    const data = {
      ok: true,
      token: require('crypto').randomBytes(32).toString('hex'),
    };
  
    return data;
  })

