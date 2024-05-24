const { z } = require("zod")

const UserZodSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required",
      }),
      lastName: z.string().min(1, {
        message: "Last name is required",
      }),
      email: z
        .string()
        .email()
        .nonempty({
          message: "Email address is required",
        })
        .transform((str) => str.toLowerCase()),
    
      phone: z.string().min(11, {
        message: "Phone number is required",
      }),
      password: z.string().min(8, {
        message: "Password is required",
      }),
      gender: z.enum(["male", "female"], {
        errorMap: (issue, ctx) => ({
          message: `${ctx.data} is not a valid gender. Gender must be either 'male' or 'female'.`,
        }),
      }),
      // createdAt: z.optional(),
      
      image: z.string().min(1, {
        message: "Please Input Your Image",
      }),
})

module.exports = UserZodSchema