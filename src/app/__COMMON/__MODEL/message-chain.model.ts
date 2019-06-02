export class MessageChainModel {
    constructor(public recipient: RecipientModel, public messages: MessageModel[]) {}
}
export class MessageModel {
    static monthArray: string[] = [
        'იანვარი',
        'თებერვალი',
        'მარტი',
        'აპრილი',
        'მაისი',
        'ივნისი',
        'ივლისი',
        'აგვისტო',
        'სექტემბერი',
        'ოქტომბერი',
        'ნოემბერი',
        'დეკემბერი'
    ];
    public decoratedTime: string;
    constructor(public id: string, public inbox: boolean, public time: string, public body: string) {
        this.decorateTime();
    }

    private decorateTime(): void {
        const today = new Date();
        const time = new Date(this.time);
        if (today.getFullYear() === time.getFullYear()) {
            if (today.getMonth() === time.getMonth() && today.getDate() === time.getDate()) {
                this.decoratedTime = time.getHours() + ':' + (time.getMinutes().toString().length === 1 ? '0' + time.getMinutes() : time.getMinutes() );
            } else {
                this.decoratedTime = time.getDate() + ' ' + MessageModel.monthArray[time.getMonth()];
            }
        } else {
            this.decoratedTime = time.getDate().toString() + ' ' + MessageModel.monthArray[time.getMonth()] + ' ' + time.getFullYear();
        }
    }
}
export class RecipientModel {

    public decoratedFullName: string = null;
    public decoratedPhoneNumber: string;

    constructor(public formattedPhoneNumber: string) {
        this.formatPhoneNumberMethod();
        this.decoratePhoneNumberMethod();
    }
    private formatPhoneNumberMethod(): void {
        if (this.formattedPhoneNumber) {
            this.formattedPhoneNumber = this.formattedPhoneNumber.replace(/\s/g, '');
            this.formattedPhoneNumber = this.formattedPhoneNumber.replace('+995', '');
        }
    }
    private decoratePhoneNumberMethod(): void {
        if (this.formattedPhoneNumber && /^\d+$/.test(this.formattedPhoneNumber)) {
            this.decoratedPhoneNumber = this.formattedPhoneNumber.slice(0, 3) + '-'
                + this.formattedPhoneNumber.slice(3, 5) + '-' + this.formattedPhoneNumber.slice(5, 7) + '-'
                + this.formattedPhoneNumber.slice(7, 9);
        } else if (this.formattedPhoneNumber && !/^\d+$/.test(this.formattedPhoneNumber)) {
            this.decoratedFullName = this.formattedPhoneNumber;
            this.decoratedPhoneNumber = this.formattedPhoneNumber;
        }
    }
}
export class MessagePreviewModel {
    static monthArray: string[] = [
        'იან',
        'თებ',
        'მარ',
        'აპრ',
        'მაი',
        'ივნ',
        'ივლ',
        'აგვ',
        'სექ',
        'ოქტ',
        'ნოე',
        'დეკ'
    ];

    constructor(public formattedPhoneNumber: string,
                public decoratedPhoneNumber: string,
                public decoratedFullName: string,
                public body: string,
                public time: string) {
        this.time = this.getTime(this.time);
    }
    private getTime(timeStamp: string): string {
        const today = new Date();
        const time = new Date(timeStamp);
        if (today.getFullYear() === time.getFullYear()) {
            if (today.getMonth() === time.getMonth() && today.getDate() === time.getDate()) {
                return time.getHours() + ':' + (time.getMinutes().toString().length === 1 ? '0' + time.getMinutes() : time.getMinutes() );
            } else {
                return time.getDate() + ' ' + MessageModel.monthArray[time.getMonth()];
            }
        } else {
            return time.getDate().toString() + ' ' + MessagePreviewModel.monthArray[time.getMonth()] + ' ' + time.getFullYear();
        }
    }
}
