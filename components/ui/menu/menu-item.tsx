import {
  DefaultMantineColor,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';

export interface MenuItemProps {
  label: string;
  color: DefaultMantineColor;
  location?: string;
  icon?: React.ReactElement;
  active?: boolean;
}

export default function MenuItem({
  label,
  icon,
  color,
  active,
}: MenuItemProps) {
  return (
    <div>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant='light'>
            <div>{icon}</div>
          </ThemeIcon>

          <Text size='sm' weight={active ? 'bold' : 'normal'} color={'dark'}>
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    </div>
  );
}
