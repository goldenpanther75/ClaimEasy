/**
 * Uploads a single file to the server
 * @param {File} file 
 * @returns {Promise<string>} The server-relative file path
 */
async function uploadFile(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file); // key must match generic upload route 'file'

    try {
        const response = await fetch('http://13.126.167.8:5000/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        return result.filePath;
    } catch (error) {
        console.error("File upload error:", error);
        return null;
    }
}

/**
 * Uploads multiple files
 * @param {FileList} fileList 
 * @returns {Promise<string[]>} Array of file paths
 */
async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return [];

    const uploadPromises = Array.from(fileList).map(file => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    return results.filter(path => path !== null);
}
