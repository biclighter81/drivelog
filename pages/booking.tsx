import { Button, Grid, NumberInput, Select, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Drivelog, Vehicle } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { Plus } from 'tabler-icons-react';
import { prisma } from '../lib/prisma';

export async function getServerSideProps() {
  return {
    props: {
      vehicle: JSON.parse(
        JSON.stringify(
          await prisma.vehicle.findMany({
            select: {
              name: true,
              drivelogs: true,
              mileage: true,
              plate: true,
            },
          })
        )
      ) as (Vehicle & { drivelogs: Array<Drivelog> })[],
    },
  };
}

export default function Booking({
  vehicle,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const bookingForm = useForm({
    initialValues: {
      plate: [
        ...vehicle.map((veh) => {
          return {
            value: veh.plate,
            label: veh.plate,
          };
        }),
      ],
      dateString: new Date(),
      previousMileage: vehicle[0]?.mileage,
      mileage: null,
    },
    validate: {
      plate: (value) => (value.length < 1 ? 'Fahrzeug auswählen!' : undefined),
      dateString: (value) => (value ? undefined : 'Datum auswählen!'),
      previousMileage: (value) =>
        value && value < 0 ? 'Kilometerstand muss positiv sein!' : undefined,
      mileage: (value) =>
        value && value < 0 ? 'Kilometerstand muss positiv sein!' : undefined,
    },
  });

  const getVehicleMileage = async (plate: string): Promise<number> => {
    const res = await fetch(`/api/vehicle/${plate}/mileage`);
    const data = (await res.json()) as number;
    return data;
  };

  const handleSubmit = async () => {
    const values = {
      ...bookingForm.values,
    };
    const res = await fetch('/api/drivelog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = (await res.json()) as Error;
      return showNotification({
        title: 'Fehler beim Speichern',
        message: err.message,
        color: 'red',
      });
    }
    const data = await res.json();
    if (data.warn) {
      showNotification({
        title: 'Warnung',
        message: data.warn,
        color: 'yellow',
      });
    } else {
      showNotification({
        title: 'Erfolgreich gespeichert',
        message: 'Drivelog wurde erfolgreich gespeichert!',
        color: 'green',
      });
    }
  };
  return (
    <>
      <h1 className='text-2xl font-black mb-12'>Fahrten eintragen</h1>

      <form onSubmit={bookingForm.onSubmit(() => handleSubmit())}>
        <Grid className='mb-12'>
          <Grid.Col span={12} sm={6}>
            <Select
              label='Fahrzeug Nummernschild'
              data={[
                ...vehicle.map((veh) => {
                  return {
                    value: veh.plate,
                    label: veh.plate,
                  };
                }),
              ]}
              required
              {...bookingForm.getInputProps('plate')}
              onChange={async (val) => {
                bookingForm.setFieldValue('plate', val as any);
                if (val) {
                  const mileage = await getVehicleMileage(val);
                  bookingForm.setFieldValue('previousMileage', mileage);
                  bookingForm.setFieldValue('mileage', mileage as any);
                }
              }}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <DatePicker
              placeholder='Datum der Fahrt'
              required
              locale='de'
              label='Datum der Fahrt'
              {...bookingForm.getInputProps('dateString')}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <NumberInput
              placeholder='Vorheriger Kilometerstand'
              required
              label='Vorheriger Kilometerstand'
              {...bookingForm.getInputProps('previousMileage')}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <NumberInput
              placeholder='Aktueller Kilometerstand'
              required
              label='Aktueller Kilometerstand'
              {...bookingForm.getInputProps('mileage')}
            />
          </Grid.Col>
          <Grid.Col>
            <Button
              leftIcon={<Plus />}
              color={'green'}
              variant={'light'}
              type={'submit'}
            >
              Fahrt eintragen
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
