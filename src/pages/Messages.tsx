import { useState } from "react";
import { Send, User, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const chats = [
    { id: 1, name: "Ana Santos", role: "Vendas", lastMessage: "Cliente aprovou orçamento", unread: 2 },
    { id: 2, name: "João Oliveira", role: "Produção", lastMessage: "Estoque de granito baixo", unread: 1 },
    { id: 3, name: "Maria Costa", role: "Financeiro", lastMessage: "Pagamento confirmado", unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "Ana Santos", content: "Cliente aprovou orçamento #123", time: "10:30", mine: false },
    { id: 2, sender: "Você", content: "Ótimo! Já criei a OS", time: "10:32", mine: true },
    { id: 3, sender: "Ana Santos", content: "Perfeito, obrigada!", time: "10:33", mine: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Lista de Conversas */}
        <Card className="col-span-4 p-4 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-10" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedChat === chat.id ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground truncate">{chat.name}</p>
                        {chat.unread > 0 && (
                          <span className="bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{chat.role}</p>
                      <p className="text-sm text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Área de Chat */}
        <Card className="col-span-8 flex flex-col">
          {/* Header do Chat */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{chats[0].name}</p>
                <p className="text-xs text-muted-foreground">{chats[0].role}</p>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${msg.mine ? "bg-primary text-primary-foreground" : "bg-muted"} p-3 rounded-lg`}>
                    {!msg.mine && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input de Mensagem */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setMessage("");
                  }
                }}
              />
              <Button className="bg-primary hover:bg-primary-hover">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
