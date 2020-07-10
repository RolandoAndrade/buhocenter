import { Module } from 'vuex/types';
import CommentsTypes from '@/store/comments/methods/comments.methods';
import { Comment } from '@/modules/client/products/interfaces/comment.interface';
import { CommentsStateInterface } from './interfaces/comments.state.interface';
import { COMMENTS_EMPTY_STATE } from './comments.state';
import commentsRepository from '@/modules/client/products/repositories/comments.repository';

const clients: Module<CommentsStateInterface, any> = {
    namespaced: true,
    state: COMMENTS_EMPTY_STATE,
    getters: {
        [CommentsTypes.getters.GET_COMMENTS](state): Comment[] {
            return state.comments;
        },
    },
    mutations: {
        [CommentsTypes.mutations.SET_COMMENTS](state, comments: Comment[]): void {
            state.comments = comments;
        },
    },
    actions: {
        async [CommentsTypes.actions.GET_ALL_PRODUCT_COMMENTS]({ commit }, id: number): Promise<boolean> {
            try {
                const response = await commentsRepository.getProductComment(id);
                if (!response.error) {
                    commit(CommentsTypes.mutations.SET_COMMENTS, response);
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },
    },
};

export default clients;
