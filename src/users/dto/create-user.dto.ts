import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({required: false})
    @IsString()
    @IsEmail()
    email?: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    image?: any;
}
