// Type definitions for JSDoc comments

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [avatar]
 * @property {string} [bio]
 * @property {number} points
 * @property {'user'|'admin'} role
 * @property {string} joinedAt
 * @property {Object} [preferences]
 * @property {string[]} [preferences.sizes]
 * @property {string[]} [preferences.styles]
 * @property {string[]} [preferences.brands]
 */

/**
 * @typedef {Object} ClothingItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} type
 * @property {string} size
 * @property {'excellent'|'good'|'fair'|'worn'} condition
 * @property {string} [brand]
 * @property {string} color
 * @property {string[]} images
 * @property {string[]} tags
 * @property {number} pointValue
 * @property {string} ownerId
 * @property {User} [owner]
 * @property {'available'|'reserved'|'swapped'|'pending_approval'|'rejected'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [approvedAt]
 * @property {string} [location]
 */

/**
 * @typedef {Object} SwapRequest
 * @property {string} id
 * @property {string} requesterId
 * @property {User} [requester]
 * @property {string} itemOfferedId
 * @property {ClothingItem} [itemOffered]
 * @property {string} itemRequestedId
 * @property {ClothingItem} [itemRequested]
 * @property {'pending'|'accepted'|'rejected'|'completed'|'cancelled'} status
 * @property {string} [message]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PointTransaction
 * @property {string} id
 * @property {string} userId
 * @property {string} itemId
 * @property {'earned'|'spent'} type
 * @property {number} amount
 * @property {string} description
 * @property {string} createdAt
 */

export {};