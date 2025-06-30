import { describe, expect, it } from "vitest";
import { validateEmployeeCode, validatePassword } from "../../src/utils/validators.js";

describe('validateEmployeeCode()', () => {
    it('accepts exactly 7 digits', () => {
        expect(validateEmployeeCode('0000000')).toBe(true)
        expect(validateEmployeeCode('1234567')).toBe(true)
    })

    it('rejects non‑digit characters', () => {
        expect(validateEmployeeCode('1234a67')).toBe(false)
        expect(validateEmployeeCode('abcdefg')).toBe(false)
    })

    it('rejects wrong length', () => {
        expect(validateEmployeeCode('123456')).toBe(false)   // 6 digits
        expect(validateEmployeeCode('12345678')).toBe(false) // 8 digits
        expect(validateEmployeeCode('')).toBe(false)
    })
})

describe('validatePassword()', () => {
    it('accepts strong passwords', () => {
        expect(validatePassword('Aa1!aaaa')).toBe(true)
        expect(validatePassword('P@ssw0rd123')).toBe(true)
    })

    it('rejects too short', () => {
        expect(validatePassword('A1!a')).toBe(false)
    })

    it('rejects missing uppercase', () => {
        expect(validatePassword('aa1!aaaa')).toBe(false)
    })

    it('rejects missing lowercase', () => {
        expect(validatePassword('AA1!AAAA')).toBe(false)
    })

    it('rejects missing digit', () => {
        expect(validatePassword('Aa!aaaaa')).toBe(false)
    })

    it('rejects missing special char', () => {
        expect(validatePassword('Aa1aaaaa')).toBe(false)
    })
})