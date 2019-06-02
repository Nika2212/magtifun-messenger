export const RESOURCE = {
    ASSETS : {
        IMAGE : {
            ICON : {
                ALERT : './assets/image/icon/exclamation-circle.svg',
                PASSWORD : './assets/image/icon/lock.svg',
                USER : './assets/image/icon/user-alt.svg',
                LOADING : './assets/image/icon/spinner-third.svg',
                SIGN_IN : './assets/image/icon/sign-in.svg',
                EYE_SELECTED : './assets/image/icon/eye_selected.svg',
                EYE : './assets/image/icon/eye.svg',
                CLOSE : './assets/image/icon/times.svg',
                CHECK : './assets/image/icon/check-circle.svg',
                COMMENT : './assets/image/icon/comment.svg',
                COMMENT_SELECTED : './assets/image/icon/comment_selected.svg',
                CONTACTS : './assets/image/icon/users.svg',
                CONTACTS_SELECTED : './assets/image/icon/users_selected.svg',
                SETTINGS : './assets/image/icon/cog.svg',
                SETTINGS_SELECTED : './assets/image/icon/cog_selected.svg',
                SEARCH: './assets/image/icon/search.svg',
                HEART: './assets/image/icon/heart.svg',
                HEART_SELECTED: './assets/image/icon/heart_selected.svg',
                LONG_ARROW_LEFT: './assets/image/icon/long-arrow-left.png',
                PAPER_PLANE: './assets/image/icon/paper-plane.svg',
                BACK: './assets/image/icon/angle-left.svg',
                SEND: './assets/image/icon/send.png',
            }
        }
    },
    NOTIFICATIONS : [
        {
            code: 0,
            type: 'ERROR',
            message: 'შეცდომა სერვერთან კავშირის დროს, შეამოწმეთ ინტერნეტი'
        },
        {
            code: 403,
            type: 'ERROR',
            message: 'მომხმარებელი ან პაროლი არასწორია, სცადეთ თავიდან'
        },
        {
            code: -2,
            type: 'ERROR',
            message: 'შეცდომა სესიის აქტივაციის დროს',
        },
        {
            code: -1,
            type: 'ERROR',
            message: 'შეცდომა, გთხოვთ გადატვირთოდ აპლიკაცია'
        },
    ],
    API : {
        MAGTICOM : {
            ROOT : 'http://www.magtifun.ge',
            LOGIN : '/index.php?lang=en&page=11',
            CHECK : '/index.php?lang=en&page=2',
            RESTORE : '/index.php?lang=ge&page=14',
            SEND : '/scripts/sms_send.php'
        }
    }
};
