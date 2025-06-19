import { Controller } from '@nestjs/common';
import { Public } from '../auth/public.decorator'; // Add this import

@Controller('posts')
@Public() // Make all endpoints in this controller public
export class PostsController {}
