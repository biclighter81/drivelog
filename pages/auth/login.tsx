import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import React, { ReactElement, useEffect, useState } from 'react';
import useUser from '../../lib/authentication/useUser';
import fetchJson, { FetchError } from '../../lib/common/fetch-json';
import { NextPageWithLayout } from '../_app';

const Login: NextPageWithLayout = () => {
  const { mutateUser } = useUser({
    redirectTo: '/profile',
    redirectIfFound: true,
  });
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? undefined : 'Ungültige E-Mail Adresse',
      password: (value) =>
        value.length < 6
          ? 'Das Passwort muss mindestens 6 Zeichen lang sein'
          : undefined,
    },
  });

  async function handleSubmit() {
    try {
      const res = mutateUser(
        await fetchJson('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(form.values),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    } catch (err) {
      if (err instanceof FetchError) {
        if (err.response.status === 401) {
        }
      }
      showNotification({
        title: 'Fehler bei der Anmeldung',
        message: 'Fehlerhafte Zugangsdaten angegeben!',
        color: 'red',
        autoClose: 5000,
      });
    }
  }

  return (
    <>
      <div className='flex h-full justify-center items-center'>
        <div className='flex justify-center items-center h-screen'>
          <div className='login'>
            <Box sx={{ minWidth: 350 }} mx='auto'>
              <div className='flex justify-center mb-10'>
                <h1 className='font-black text-4xl'>LOGIN</h1>
              </div>
              <form onSubmit={form.onSubmit(() => handleSubmit())}>
                <TextInput
                  label='E-Mail'
                  {...form.getInputProps('email')}
                  my='sm'
                />
                <PasswordInput
                  label='Password'
                  {...form.getInputProps('password')}
                  my='sm'
                />
                <Group position='left' mt='md'>
                  <Button type='submit' variant='light'>
                    Anmelden
                  </Button>
                </Group>
              </form>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

//Empty layout for login page
Login.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;
