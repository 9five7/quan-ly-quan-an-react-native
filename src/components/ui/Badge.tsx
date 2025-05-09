import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import tw from 'src/utils/tw'

type Props = TouchableOpacityProps & {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
}

export function Button({ children, variant = 'default', size = 'default', ...props }: Props) {
  const base = 'items-center justify-center rounded-md'
  const variants = {
    default: 'bg-blue-500',
    outline: 'border border-blue-500'
  }
  const sizes = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1'
  }
  const textVariants = {
    default: 'text-white',
    outline: 'text-blue-500'
  }

  return (
    <TouchableOpacity
      {...props}
      style={tw`${base} ${variants[variant]} ${sizes[size]} ${props.disabled ? 'opacity-50' : ''}`}
    >
      <Text style={tw`${textVariants[variant]} text-sm font-medium`}>{children}</Text>
    </TouchableOpacity>
  )
}
