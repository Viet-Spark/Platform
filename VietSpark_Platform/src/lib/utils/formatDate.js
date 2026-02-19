// Function to format date for datetime-local input
export function formatDateForDateTimeInput(timestamp) {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp
    } else {
        date = new Date(timestamp); // Handle regular date string
    }
        
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    // Format to YYYY-MM-DDThh:mm
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Function to format date for date input
export function formatDateForDateInput(timestamp) {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp
    } else {
        date = new Date(timestamp); // Handle regular date string
    }
        
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    // Format to YYYY-MM-DDThh:mm
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    
    return `${year}-${month}-${day}`;
};

export function formatDate(timestamp) {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.seconds) {
        // Firestore Timestamp format
        date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
        // Date string format (YYYY-MM-DD) - add timezone to avoid UTC issues
        date = new Date(timestamp + 'T00:00:00');
    } else {
        // Try to parse as regular date
        date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatDetailDate(timestamp) {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp
    } else {
        date = new Date(timestamp); // Handle regular date string
    }
        
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(date);
}

export function formatTime(timestamp) {
    if (!timestamp || !timestamp.seconds) return '';

    const date = new Date(timestamp.seconds * 1000);
    let timezone = getTimezoneAbbreviation(date); 
    const formatAMPM = date => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        minutes = String(minutes).padStart(2, '0');
        return `${hours}:${minutes} ${ampm} ${timezone}`;
    };

    return formatAMPM(date);
}

export function getTimezoneAbbreviation(date = new Date()) {
    // Convert date to string and extract abbreviation from parentheses
    const match = date.toString().match(/\(([^)]+)\)/);
    if (match && match[1]) {
        return match[1].split(' ').map(word => word[0]).join('');
    }
    return 'UTC'; // fallback if no match
}

export function formatDateFromStr(input) {
	// Append U.S. timezone offset (-08:00 for Pacific)
	const usDateStr = input + "T00:00:00-08:00";
	const date = new Date(usDateStr);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}