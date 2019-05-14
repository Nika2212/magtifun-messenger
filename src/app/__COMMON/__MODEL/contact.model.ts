export class ContactModel {
    public decoratedPhoneNumber: string;

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public favorite: boolean,
        public formattedPhoneNumber: string
    ) {
        this.formatPhoneNumberMethod();
        this.decoratePhoneNumberMethod();
    }

    public getContactFullName(): string {
        return this.firstName + ' ' + (this.lastName ? this.lastName : '');
    }
    private formatPhoneNumberMethod(): void {
        if (this.formattedPhoneNumber) {
            this.formattedPhoneNumber = this.formattedPhoneNumber.replace(/\s/g, '');
            this.formattedPhoneNumber = this.formattedPhoneNumber.replace('+995', '');
        }
    }
    private decoratePhoneNumberMethod(): void {
        if (this.formattedPhoneNumber) {
            this.decoratedPhoneNumber = '+(995) ' + this.formattedPhoneNumber.slice(0, 3) + '-'
                + this.formattedPhoneNumber.slice(3, 5) + '-' + this.formattedPhoneNumber.slice(5, 7) + '-'
                + this.formattedPhoneNumber.slice(7, 9);
        }
    }
}
