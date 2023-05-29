let subs_Table = new Array(16)
subs_Table = [
    0b11110000, // 0-7
    0b11111111, // 8-15
    0b00000011, // 16-23
    0b00000101, // 24-31
    0b00000000, // 32-39
    0b00000000, // 40-47
    0b00001100, // 48-55
    0b00000000, // 56-63
    0b00000000, // 64-71
    0b00000000, // 72-79
    0b00000000, // 80-87
    0b00000000, // 88-95
    0b10000000, // 96-103
    0b00011111, // 104-111
    0b00000000, // 112-119
    0b10000000, // 120-127
]
// eslint-disable-next-line import/no-anonymous-default-export
export default new Uint8Array(subs_Table)