function uploadImage(folderName,fileImage){
    return{
        Bucket: 'practica2-semi1-a-2s2024-imagenes-g7',
        Key: `${folderName}/${fileImage.originalname}`,
        Body: fileImage.buffer,
        ContentType:fileImage.mimetype
    };
}


function deleteImage(folderName,fileName){
    return{
        Bucket: 'practica2-semi1-a-2s2024-imagenes-g7',
        Key: `${folderName}/${fileName}`
    };
}

function getAllImageS3(folderName){
    return{
        Bucket: 'practica2-semi1-a-2s2024-imagenes-g7',
        Prefix: folderName
    };
}
module.exports = {uploadImage,deleteImage,getAllImageS3};


