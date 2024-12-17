import { Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAuthContext } from '@/providers/AuthProvider'
import { useToast } from '@/components/ui/use-toast'

const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
  confirmPassword: z.string(),
  verificationCode: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth/register',
  component: () => {
    const [isVerifying, setIsVerifying] = useState(false)
    const [showVerification, setShowVerification] = useState(false)
    const auth = useAuthContext()
    const { toast } = useToast()

    const form = useForm<RegisterForm>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      }
    })

    const onSubmit = async (data: RegisterForm) => {
      try {
        if (!showVerification) {
          setIsVerifying(true)
          await auth.signUp(data.email, data.password)
          setShowVerification(true)
          toast({
            title: "验证码已发送",
            description: "请查看控制台输出的验证码",
          })
        } else if (data.verificationCode) {
          await auth.verifyEmail(data.verificationCode)
          toast({
            title: "注册成功",
            description: "邮箱验证完成，正在跳转...",
          })
          window.location.href = '/upload'
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "操作失败",
          description: (error as Error).message,
        })
      } finally {
        setIsVerifying(false)
      }
    }

    return (
      <>
        <Helmet>
          <title>注册 - APP视频分析系统</title>
          <meta name="description" content="注册账户，免费体验APP视频分析功能，获取详细PRD文档。" />
          <meta name="keywords" content="注册,APP分析,视频分析,用户注册" />
          <link rel="canonical" href="/auth/register" />
        </Helmet>
        <div className="max-w-md mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">注册账户</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!showVerification ? (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱地址</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>确认密码</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>验证码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入邮箱收到的验证码" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? '处理中...' : (showVerification ? '验证' : '注册')}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-gray-600">
            已有账户？{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              登录
            </a>
          </p>
        </div>
      </>
    )
  },
})
