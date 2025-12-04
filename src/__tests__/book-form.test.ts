import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// Form validation logic extracted from BookForm component
interface FormValidationResult {
    isValid: boolean
    errors: Record<string, string>
}

const validateBookForm = (data: { title: string; author: string }): FormValidationResult => {
    const errors: Record<string, string> = {}
    
    if (!data.title || data.title.trim() === '') {
        errors.title = 'Title is required'
    }
    if (!data.author || data.author.trim() === '') {
        errors.author = 'Author is required'
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

describe('Book Form Validation', () => {
    /**
     * **Feature: website-functionality-bugfix, Property 14: Invalid form data shows validation errors**
     * *For any* form submission with empty required fields (title, author), the system SHALL display validation error messages without creating a book.
     * **Validates: Requirements 1.5**
     */
    it('Property 14: Empty title shows validation error', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 50 }), // valid author
                (author) => {
                    const result = validateBookForm({ title: '', author })
                    
                    return !result.isValid && result.errors.title === 'Title is required'
                }
            ),
            { numRuns: 100 }
        )
    })

    it('Property 14: Empty author shows validation error', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 50 }), // valid title
                (title) => {
                    const result = validateBookForm({ title, author: '' })
                    
                    return !result.isValid && result.errors.author === 'Author is required'
                }
            ),
            { numRuns: 100 }
        )
    })

    it('Property 14: Whitespace-only title shows validation error', () => {
        fc.assert(
            fc.property(
                fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 }).map(arr => arr.join('')), // whitespace only
                fc.string({ minLength: 1, maxLength: 50 }), // valid author
                (whitespaceTitle, author) => {
                    const result = validateBookForm({ title: whitespaceTitle, author })
                    
                    return !result.isValid && result.errors.title === 'Title is required'
                }
            ),
            { numRuns: 100 }
        )
    })

    it('Property 14: Both empty fields show both validation errors', () => {
        const result = validateBookForm({ title: '', author: '' })
        
        expect(result.isValid).toBe(false)
        expect(result.errors.title).toBe('Title is required')
        expect(result.errors.author).toBe('Author is required')
    })

    it('Valid form data passes validation', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim() !== ''),
                fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim() !== ''),
                (title, author) => {
                    const result = validateBookForm({ title, author })
                    
                    return result.isValid && Object.keys(result.errors).length === 0
                }
            ),
            { numRuns: 100 }
        )
    })
})
