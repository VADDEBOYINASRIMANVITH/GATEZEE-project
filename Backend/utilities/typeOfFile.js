exports.typeOfFile = (fileType) => {
    if (fileType === 'image/jpeg') {
        return 'jpg';
    } else if (fileType === 'image/png') {
        return 'png';
    } else if (fileType === 'application/pdf') {
        return 'pdf';
    } else if (fileType === 'application/msword') {
        return 'doc';
    } else if (
        fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return 'docx';
    } else return 'txt';
};

exports.generateRandomFile = () => {
    filename = '';
    for (var i = 1; i <= 8; i++) {
        // Math.floor(Math.random() * 26);//returns a number between 0 to 25.
        filename += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return filename;
};
