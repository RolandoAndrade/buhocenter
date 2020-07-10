export default {
    onlyLetters: (word: string): boolean => {
        const pattern = new RegExp('^[A-Z]+$', 'i');
        if (word) {
            return pattern.test(word);
        }
        return false;
    },
    isAdult: (date: string): boolean => {
        const today = new Date();
        const birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    },
    validateEmail: (email: string): boolean => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    required() {
        return (v: string | boolean) => !!v || 'This field is required';
    },
    requiredPhoto(index: number, file: any) {
        return index == 0 && file == '' ? 'This field is required' : true;
    },
    minPsswdLength() {
        return (v: [] | string) => !v || v.length > 5 || 'La contraseña debe tener mínimo 6 caracteres';
    },
    matchPsswd(psswd: string, confirmedPsswd: string) {
        return psswd === confirmedPsswd || 'Las contraseñas deben coincidir';
    },
    fieldLength(maxLength: number) {
        return (v: [] | string) =>
            (v && v.length <= maxLength) || 'El campo no debe exceder el límite de caracteres';
    },
    fieldMaxLength(maxLength: number) {
        return (v: [] | string) =>
            v.length <= maxLength || 'El campo no debe exceder el límite de caracteres';
    },
    notEmpty() {
        return (v) => v.length > 0 || 'This field is required';
    },
    notNegative(number: number) {
        return number > 0 ? true : 'The number must be greater than 0';
    },
    requiredDropdown(item: any) {
        return item != '' ? true : 'This field is required';
    },
};
