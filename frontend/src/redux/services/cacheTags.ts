interface WithId {
    id: number;
}

export const LIST_ID = "LIST" as const;

// the shared LIST tag for a tag type, used by both a list's providesTags and a
// create mutation's invalidatesTags so creating a row refetches the list
export const listTag = <TagType extends string>(type: TagType) => ({
    type,
    id: LIST_ID,
});

// list-query providesTags: one tag per row plus the shared LIST tag, so item
// updates/deletes invalidate their own id while a create invalidates the LIST
export const listProvidesTags = <TagType extends string>(
    type: TagType,
    result: WithId[] | undefined,
) =>
    result
        ? [...result.map(({ id }) => ({ type, id })), listTag(type)]
        : [listTag(type)];
