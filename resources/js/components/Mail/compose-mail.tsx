import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useState } from 'react';

export default function ComposeMail() {
    const [newMail, setNewMail] = useState({ email: '', subject: '', content: '' });

    const sendNewMail = async () => {
        try {
            const response = await axios.post('mails/new-mail', newMail);
            console.log('Mail sent:', response.data.mail);
        } catch (error) {
            console.error('Error sending mail:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Compose Mail</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send New Mail</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <Input
                        type="email"
                        placeholder="Receiver Email"
                        value={newMail.email}
                        onChange={(e) => setNewMail({ ...newMail, email: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Subject"
                        value={newMail.subject}
                        onChange={(e) => setNewMail({ ...newMail, subject: e.target.value })}
                    />
                    <Textarea placeholder="Content" value={newMail.content} onChange={(e) => setNewMail({ ...newMail, content: e.target.value })} />
                </div>
                <DialogFooter>
                    <Button onClick={sendNewMail} variant="default">
                        Send Mail
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
