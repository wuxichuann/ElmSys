import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty({ message: '旧密码不能为空' })
    oldPassword!: string;

    @IsString()
    @MinLength(6, { message: '新密码至少需要6位' })
    // 可以添加正则表达式来强制密码复杂度
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: '密码过于简单' })
    newPassword!: string;
}