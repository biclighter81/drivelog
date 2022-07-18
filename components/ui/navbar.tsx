import { useRouter } from 'next/router';
import { Bookmark, Car, Home, Table } from 'tabler-icons-react';
import MenuItem, { MenuItemProps } from './menu/menu-item';

export default function AppNavbar() {
  const router = useRouter();

  const items: Array<MenuItemProps> = [
    {
      label: 'Startseite',
      icon: <Table />,
      color: 'indigo',
      location: '/',
    },
    {
      label: 'Buchung',
      icon: <Bookmark />,
      color: 'yellow',
      location: '/booking',
    },
    {
      label: 'Fahrzeuge',
      icon: <Car />,
      color: 'green',
      location: '/vehicles',
    },
  ];

  return (
    <>
      {items.map((item) => (
        <div
          key={item.location}
          onClick={(e) => router.push(item.location ? item.location : '/')}
        >
          <MenuItem
            label={item.label}
            icon={item.icon}
            color={item.color}
            active={item.location == router.pathname}
          />
        </div>
      ))}
    </>
  );
}
