import { Module } from 'vuex';
import BaseTypes from '@/store/base-module/methods/base-methods';
import BaseModel from './models/BaseModel';
import BaseRepository from '@/modules/base-module/repositories/base.repository';

const baseModule: Module<any, any> = {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
} 

export default baseModule;