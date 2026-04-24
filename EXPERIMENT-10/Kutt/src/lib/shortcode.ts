/**
 * Custom shortcode generator mapped to digits.
 * The counter starts effectively from ID 10000 by adding an offset of 9999.
 */

const ID_OFFSET = 9999;

const CHAR_MAP: Record<string, string[]> = {
    '1': ['A', 'a', '1'],
    '2': ['B', 'b', '2'],
    '3': ['C', 'c', '3'],
    '4': ['D', 'd', '4'],
    '5': ['E', 'e', '5'],
    '6': ['Z', 'z', '6'],
    '7': ['G', 'g', '7'],
    '8': ['H', 'h', '8'],
    '9': ['K', 'k', '9'],
    '0': ['M', 'm', '0'],
};

// Create a reverse map for decoding
const REVERSE_MAP: Record<string, string> = {};
for (const [digit, chars] of Object.entries(CHAR_MAP)) {
    for (const char of chars) {
        REVERSE_MAP[char] = digit;
    }
}

/**
 * Encodes an integer ID into the customized shortcode string.
 */
export function encode(num: number): string {
    const offsetNum = num + ID_OFFSET; // ID 1 becomes 10000
    const strNum = offsetNum.toString();
    
    let result = '';
    for (const digit of strNum) {
        const chars = CHAR_MAP[digit];
        if (!chars) {
            throw new Error(`Invalid digit '${digit}' encountered during encoding.`);
        }
        // Select a random character from the mapped array
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        result += randomChar;
    }
    
    return result;
}

/**
 * Decodes the custom shortcode string back into the original integer ID.
 */
export function decode(str: string): number {
    let digitStr = '';
    for (const char of str) {
        const digit = REVERSE_MAP[char];
        if (digit === undefined) {
            throw new Error(`Invalid character '${char}' in shortcode string.`);
        }
        digitStr += digit;
    }
    
    const offsetNum = parseInt(digitStr, 10);
    return offsetNum - ID_OFFSET;
}
