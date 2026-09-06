type BaseResponse<T, E = T> =
    | {
        success: true;
        data: T;
        message?: string;
        errors?: never
    }
    | {
        success: false;
        data?: never;
        message: string;
        // O 'Partial<Record<keyof E, string[]>>' mapeia as chaves do objeto para string[]
        errors?: Partial<Record<keyof E, string[]>>
    };

export type ApiResponse<T, E = T> = Promise<BaseResponse<T, E>>