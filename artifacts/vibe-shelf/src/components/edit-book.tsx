import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateBook, getListBooksQueryKey, getGetBookQueryKey, getGetShelfStatsQueryKey } from "@workspace/api-client-react";
import type { Book } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Loader2 } from "lucide-react";

const editBookSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  projectName: z.string().min(1, "Project name is required"),
  githubLink: z.string().url("Must be a valid URL").min(1, "GitHub link is required"),
  liveLink: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.undefined()]),
  email: z.union([z.string().email("Must be a valid email"), z.literal(""), z.undefined()]),
  description: z.union([z.string(), z.literal(""), z.undefined()]),
});

type EditBookValues = z.infer<typeof editBookSchema>;

interface EditBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBookModal({ book, isOpen, onClose }: EditBookModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateBook = useUpdateBook();

  const form = useForm<EditBookValues>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      firstName: book.firstName,
      lastName: book.lastName,
      projectName: book.projectName,
      githubLink: book.githubLink,
      liveLink: book.liveLink ?? "",
      email: book.email ?? "",
      description: book.description ?? "",
    },
  });

  const onSubmit = (data: EditBookValues) => {
    const payload = {
      ...data,
      liveLink: data.liveLink || undefined,
      email: data.email || undefined,
      description: data.description || undefined,
    };

    updateBook.mutate(
      { id: book.id, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetBookQueryKey(book.id) });
          queryClient.invalidateQueries({ queryKey: getGetShelfStatsQueryKey() });
          toast({
            title: "Book updated",
            description: "Your changes have been saved to the shelf.",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not update the book. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[500px] parchment-texture border-amber-900/20 shadow-2xl bg-card text-card-foreground">
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-amber-900/10 rounded-full flex items-center justify-center mb-4 text-amber-900">
            <Pencil size={24} />
          </div>
          <DialogTitle className="text-2xl font-serif text-center text-amber-950">
            Edit Book
          </DialogTitle>
          <DialogDescription className="text-center font-sans text-amber-900/70">
            Update the details for "{book.projectName}".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-950">First Name</FormLabel>
                    <FormControl>
                      <Input className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
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
                      <Input className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
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
                    <Input className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
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
                    <Textarea
                      placeholder="A short description of your project..."
                      className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50 resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                    <Input className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
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
                    <Input type="email" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-amber-900/30 text-amber-900 hover:bg-amber-900/10"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 font-serif text-lg tracking-wide bg-amber-800 hover:bg-amber-900 text-white"
                disabled={updateBook.isPending}
              >
                {updateBook.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
