export function validateFile(file, { allowedTypes, maxSizeMB }) {
    if (!file) return 'No file provided';
    
    if (!allowedTypes.includes(file.type)) {
        return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
}

export function validateImageFile(file) {
    const validationError = validateFile(file, {
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSizeMB: 5
    });
    return validationError;
}

export function validateVideoFile(file) {
    const validationError = validateFile(file, {
        allowedTypes: ['video/mp4', 'video/webm'],
        maxSizeMB: 150
    });
    return validationError;
}