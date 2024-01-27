//******* Manos ********  https://www.youtube.com/watch?v=1MTyCvS05V4 Antonio   */
import * as z from  "zod";

export const  RegisterSchema = z.object({ 
    email: z.string().email({message: "Email is required",} ),
    password: z.string().min(4, {message: "Minimum 4 characters , required"}),
    name: z.string().min(1, {message:"Name is required"})          // --> dispname: string;
  
});
