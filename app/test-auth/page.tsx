'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });

      if (error) {
        setMessage(`Sign Up Error: ${error.message}`);
      } else {
        setMessage(`Sign Up Success: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (_err) {
      setMessage(`Sign Up Exception: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`Sign In Error: ${error.message}`);
      } else {
        setMessage(`Sign In Success: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (_err) {
      setMessage(`Sign In Exception: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(`Session Error: ${error.message}`);
      } else {
        setMessage(`Session: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (_err) {
      setMessage(`Session Exception: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label>Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <label>Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="testpassword123"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testSignUp} disabled={loading} size="sm">
              Test Sign Up
            </Button>
            <Button onClick={testSignIn} disabled={loading} size="sm">
              Test Sign In
            </Button>
            <Button onClick={testSession} disabled={loading} size="sm">
              Test Session
            </Button>
          </div>

          {message && (
            <div className="p-4 bg-gray-100 rounded text-sm">
              <pre className="whitespace-pre-wrap">{message}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
