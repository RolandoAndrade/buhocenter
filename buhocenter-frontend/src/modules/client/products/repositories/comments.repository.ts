import { HttpRepository } from '@/http/http.repository';
import { Comment } from '../interfaces/comment.interface';

class CommentsRepository extends HttpRepository {
    private static readonly RESOURCE = 'product-ratings';

    public getProductComment(id: number): Promise<Comment> {
        return this.get(`${CommentsRepository.RESOURCE}?productId=${id}`);
    }
}

export default new CommentsRepository();
