import { atom, atomFamily, selector } from "recoil"
import { getCard } from "@bit/vitorbarbosa19.ziro.pay.zoop"

/**
 * ZoopCard atom family
 */
export const zoopCard = atomFamily({
    key: "card",
    default: (id: string) => getCard(id)
})

/**
 * CardId of card been registered
 */
export const cardIdBeenRegistered = atom<string>({
    key: "card-id-been-registered",
    default: null
})

/**
 * Card info of card been registered
 */
export const cardBeenRegistered = selector({
    key: "card-been-registered",
    get: ({ get }) => {
        const id = get(cardIdBeenRegistered)
        if(!id) return null
        return get(zoopCard(id))
    }
})

/**
 * CardId of card been used
 */
export const cardIdBeenUsed = atom<string>({
    key: "card-id-been-used",
    default: null
})

/**
 * Card info of card been used
 */
export const cardBeenUsed = selector({
    key: "card-been-used",
    get: ({ get }) => {
        const id = get(cardIdBeenUsed)
        if(!id) return null
        return get(zoopCard(id))
    }
})