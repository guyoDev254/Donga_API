import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    name: string

    @ApiProperty({required: false})
    email?: string

    @ApiProperty()
    phone: string

    @ApiProperty()
    address: string

    @ApiProperty()
    password: string

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    image?: any;
}
