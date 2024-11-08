declare const __DEV__: boolean;

interface ImportMetaEnv {
    readonly PUBLIC_API_URL: string;
}

declare type sdkResponse<B> = { status: number; body: B };

declare type sdkFunction<B extends sdkResponse<any>> = (
    ...args: any[]
) => Promise<B>;

declare type selectResponse<
    sdk extends sdkFunction<any>,
    status extends number,
> = Extract<Awaited<ReturnType<sdk>>, { status: status }>['body'];
