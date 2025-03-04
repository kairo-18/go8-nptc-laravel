import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import NPTCBg from '../../../../public/assets/NPTCBg.png';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className='flex flex-col md:flex-row h-full w-full bg-white overflow-hidden'>
            <div className='hidden md:flex flex-row p-7 pr-0 h-screen w-1/2 rounded-l-md'>
                <div className='p-10 bg-[#2A2A92] h-full w-full rounded-l-md'>
                    <div className='flex flex-col py-20 h-3/4 w-full justify-center items-center'>
                        <img className='w-full h-full object-contain' src={NPTCBg} alt="NPTC" />
                    </div>
                    <div className='flex flex-col h-1/4 w-full items-center'>
                        <h1 className='text-white font-bold md:text-lg lg:text-xl xl:text-2xl'>NATIONAL PUBLIC TRANSPORT COALITION</h1>
                    </div>
                </div>
            </div>
            <div className='flex flex-row p-7 pl-0 h-screen w-full md:w-1/2 justify-center rounded-r-md overflow-auto'>
                <AuthLayout title="NPTC" description="Login Account">
                    <Head title="Log in" />
                    <form className="flex flex-col gap-6 px-5 md:px-15" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email"
                                    className="border-gray-300"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="border-gray-300"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                                <div className="flex flex-row items-center space-x-3 pb-3 md:pb-0">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <div className="flex flex-row items-center md:ml-auto">
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="text-sm text-black" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="mt-4 w-full bg-[#2A2A92] text-white" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Log in
                            </Button>
                        </div>

                        {/* <div className="text-muted-foreground text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={route('register')} tabIndex={5} className='text-black'>
                                Sign up
                            </TextLink>
                        </div> */}
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </AuthLayout>
            </div>
        </div>
    );
}
