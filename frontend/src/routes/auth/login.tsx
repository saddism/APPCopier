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

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

type LoginForm = z.infer<typeof loginSchema>

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    const [isLoading, setIsLoading] = useState(false)
    const auth = useAuthContext()
    const { toast } = useToast()

    const form = useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
      }
    })

    const onSubmit = async (data: LoginForm) => {
      try {
        setIsLoading(true)
        await auth.signIn(data.email, data.password)
        toast({
          title: "登录成功",
          description: "正在跳转...",
          variant: "default",
        })
        window.location.href = '/upload'
      } catch (error) {
        toast({
          variant: "destructive",
          title: "登录失败",
          description: (error as Error).message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <>
        <Helmet>
          <title>登录 - APP视频分析系统</title>
          <meta name="description" content="登录您的账户，开始分析APP视频并生成PRD文档。" />
          <meta name="keywords" content="登录,APP分析,视频分析,用户登录" />
          <link rel="canonical" href="/login" />
        </Helmet>
        <div className="max-w-md mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">登录</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-gray-600">
            还没有账户？{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              注册
            </a>
          </p>
        </div>
      </>
    )
  },
})
