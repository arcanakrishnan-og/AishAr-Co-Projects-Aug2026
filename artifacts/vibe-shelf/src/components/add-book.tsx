import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBook } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBooksQueryKey, getGetShelfStatsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { LibraryBig, Loader2, Lock, Crown } from "lucide-react";

const WEEKS = [1, 2, 3, 4, 5, 6] as const;
const BADGE_CODE = "Goldcrown";

const addBookSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  projectName: z.string().min(1, "Project name is required"),
  description: z.union([z.string(), z.literal(""), z.undefined()]),
  githubLink: z.string().url("Must be a valid URL").min(1, "GitHub link is required"),
  liveLink: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.undefined()]),
  email: z.union([z.string().email("Must be a valid email"), z.literal(""), z.undefined()]),
  week: z.union([z.number().min(1).max(6), z.undefined()]),
  isBadged: z.boolean().default(false),
});

type AddBookValues = z.infer<typeof addBookSchema>;

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createBook = useCreateBook();
  const [secretCode, setSecretCode] = useState("");

  const codeUnlocked = secretCode === BADGE_CODE;

  const form = useForm<AddBookValues>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      projectName: "",
      description: "",
      githubLink: "",
      liveLink: "",
      email: "",
      week: undefined,
      isBadged: false,
    },
  });

  const isBadged = form.watch("isBadged");

  const onSubmit = (data: AddBookValues) => {
    const payload = {
      ...data,
      description: data.description || undefined,
      liveLink: data.liveLink || undefined,
      email: data.email || undefined,
      week: data.week ?? undefined,
      isBadged: codeUnlocked ? data.isBadged : false,
    };

    createBook.mutate(
      { data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetShelfStatsQueryKey() });
          toast({
            title: "Book placed on shelf",
            description: "Your project has been successfully added to the library.",
          });
          form.reset();
          setSecretCode("");
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not add your book. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setSecretCode("");
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px] parchment-texture border-amber-900/20 shadow-2xl bg-card text-card-foreground max-h-[92vh] flex flex-col overflow-hidden">
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-amber-900/10 rounded-full flex items-center justify-center mb-4 text-amber-900">
            <LibraryBig size={24} />
          </div>
          <DialogTitle className="text-2xl font-serif text-center text-amber-950">
            Add Your Book
          </DialogTitle>
          <DialogDescription className="text-center font-sans text-amber-900/70">
            Immortalise your vibe-coded project on the library shelves.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-sans overflow-y-auto flex-1 pr-1">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-950">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ada" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-950">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lovelace" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Analytical Engine" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of this project..." className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50 resize-none h-20" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Week</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    value={field.value != null ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 border-amber-900/20 focus:ring-amber-900/50">
                        <SelectValue placeholder="Select a week..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WEEKS.map((w) => (
                        <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Collaboration Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ada@example.com" type="email" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            {/* Badge section — gated by secret code */}
            <div className="border border-amber-900/20 rounded-md p-3 bg-amber-900/5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900/70 text-xs font-sans uppercase tracking-wider">
                <Lock size={12} />
                <span>Special Recognition</span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Enter code to unlock..."
                  className={`bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50 text-sm flex-1 ${
                    codeUnlocked ? "border-amber-500 ring-1 ring-amber-400" : ""
                  }`}
                  autoComplete="off"
                />
                {codeUnlocked && (
                  <span className="text-amber-500 text-lg">👑</span>
                )}
              </div>

              {codeUnlocked && (
                <FormField
                  control={form.control}
                  name="isBadged"
                  render={({ field }) => (
                    <FormItem>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-md border-2 transition-all font-sans text-sm ${
                          field.value
                            ? "border-amber-500 bg-amber-50 text-amber-900"
                            : "border-amber-900/20 bg-white/30 text-amber-900/60"
                        }`}
                      >
                        <Crown
                          size={18}
                          className={field.value ? "text-amber-500" : "text-amber-900/30"}
                          fill={field.value ? "currentColor" : "none"}
                        />
                        <div className="text-left flex-1">
                          <div className="font-semibold">AI Builder of the Week</div>
                          <div className="text-xs opacity-70">Displays a golden crown on the book spine</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          field.value ? "border-amber-500 bg-amber-500" : "border-amber-900/30"
                        }`}>
                          {field.value && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-serif text-lg tracking-wide bg-amber-800 hover:bg-amber-900 text-white"
                disabled={createBook.isPending}
              >
                {createBook.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shelving...
                  </>
                ) : (
                  "Place on Shelf"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
