import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                white: '#ffffff',
                primary: '#907F46',
                secondary: '#CAB776',
                accent: '#F1CABB',
                error: '#ff5252',
                info: '#F3F3F3',
                success: '#108043',
                warning: '#ffb822',
            },
        },
    },
});
