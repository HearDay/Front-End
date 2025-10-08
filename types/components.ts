//모달버튼
export interface ModalButtonProps {
    title: string
    onPress: () => void
    variant?: 'voice' | 'chat' | 'skip'
}

//모달
export interface ModalProps {
    visible: boolean
    title: string
    onConfirm: () => void
    onClose?: () => void
    confirmText?: string
    confirmDisabled?: boolean
    children?: React.ReactNode
}

//스피너
export interface SpinnerProps {
    size?: 'small' | 'large'
    color?: string
    fullScreen?: boolean
}

//카테고리 낱개
export interface CategoryChipProps {
    label: string
    isSelected: boolean
    onPress: () => void
}

//카테고리 그룹
export interface CategoryChipGroupProps {
    categories: string[]
    selectedCategory: string | null
    onSelectCategory: (category: string) => void
}