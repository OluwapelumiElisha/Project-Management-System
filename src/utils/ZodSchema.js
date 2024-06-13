const { z } = require("zod")

const UserZodSchema = z.object({
    // name: z.string().min(1, {
    //     message: "Name is required",
    //   }),
      title: z.string().min(1, {
        message: "Title is required",
      }),
      userName: z.string().min(1, {
        message: "User Name is required",
      }),
      email: z
        .string()
        .email()
        .nonempty({
          message: "Email address is required",
        })
        .transform((str) => str.toLowerCase()),
    
      // phone: z.string().min(11, {
      //   message: "Phone number is required",
      // }),
      password: z.string().min(6, {
        message: "Password is required",
      }).max(20),
      // gender: z.enum(["male", "female"], {
      //   errorMap: (issue, ctx) => ({
      //     message: `${ctx.data} is not a valid gender. Gender must be either 'male' or 'female'.`,
      //   }),
      // }),
      // createdAt: z.optional(),
      
      image: z.string().min(1, {
        message: "Please Input Your Image",
      }),
      // lastActive: z.date()
})

module.exports = UserZodSchema