import z from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
