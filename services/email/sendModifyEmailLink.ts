import sendStudentMailTemplate from '../sendStudentMailTemplate';

const sendModifyEmailLink = async (
    email: string,
    modifyEmailUrl: string,
    token: string
): Promise<void> => {
    await sendStudentMailTemplate(
        email,
        modifyEmailUrl,
        token,
        'modifyEmailLink',
        'Modifier mon email'
    );
};

export default sendModifyEmailLink;